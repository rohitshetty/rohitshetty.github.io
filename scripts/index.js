#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const yaml = require("js-yaml");
const AWS = require("aws-sdk");

program
  .option(
    "-d, --directory <directory>",
    "Specify the starting directory for the search"
  )
  .option("-p, --profile <profile>", "Specify the AWS profile for credentials")
  .option(
    "--development",
    "Run in development mode (skip downloading if files exist)"
  )
  .parse(process.argv);

const options = program.opts();
const awsProfile = options.profile; // Use the specified AWS profile or 'default' by default
if (awsProfile) {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: awsProfile,
  });
} else {
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  AWS.config.update({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  });
}

AWS.config.update({ region: process.env.AWS_REGION || "ap-south-1" }); // Replace with your desired AWS region

const s3 = new AWS.S3();

async function downloadFolder(bucketName, folderPath, destinationPath) {
  console.log("Download bucket:", bucketName, folderPath, destinationPath);

  const params = {
    Bucket: bucketName,
    Prefix: folderPath,
  };

  try {
    const response = await s3.listObjectsV2(params).promise();
    for (const item of response.Contents) {
      const sourceKey = item.Key;
      const destinationKey = path.join(
        destinationPath,
        path.basename(sourceKey)
      );

      if (options.development && fs.existsSync(destinationKey)) {
        // If in development mode and file exists, skip downloading
        console.log(`Skipping download for existing file: ${destinationKey}`);
        continue;
      }

      const response = await s3
        .getObject({ Bucket: bucketName, Key: sourceKey })
        .promise();
      fs.writeFileSync(destinationKey, response.Body);
      console.log(`Downloaded: ${destinationKey}`);
    }
  } catch (error) {
    console.error(`Error downloading folder: ${error.message}`);
    return Promise.reject(`Error downloading folder: ${error.message}`);
  }
}

async function downloadFiles(filePaths, destinationPath) {
  for (const filePath of filePaths) {
    const fileName = path.basename(filePath);
    const fileDestination = path.join(destinationPath, fileName);
    const s3Uri = new URL(filePath);
    const bucketName = s3Uri.hostname;
    const objectKey = s3Uri.pathname.substring(1);

    if (options.development && fs.existsSync(fileDestination)) {
      // If in development mode and file exists, skip downloading
      console.log(`Skipping download for existing file: ${fileDestination}`);
      continue;
    }

    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };

    try {
      const data = await s3.getObject(params).promise();
      fs.writeFileSync(fileDestination, data.Body);
      console.log(`Downloaded: ${fileDestination}`);
    } catch (error) {
      console.error(`Error downloading file ${filePath}: ${error.message}`);
      return Promise.reject(`Error downloading folder: ${error.message}`);
    }
  }
}

async function findImagesYmlFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await findImagesYmlFiles(filePath);
    } else if (file === "images.yml") {
      try {
        const yamlContent = fs.readFileSync(filePath, "utf8");
        const jsonData = yaml.load(yamlContent);
        console.log(jsonData);

        for (const folderName in jsonData) {
          if (jsonData.hasOwnProperty(folderName)) {
            const folderData = jsonData[folderName];

            const destinationPath = path.join(dir, folderName);

            if (folderData.hasOwnProperty("folder")) {
              const s3Uri = folderData.folder;
              fs.mkdirSync(destinationPath, { recursive: true });
              console.log("s3Uri:", s3Uri);
              const paths = s3Uri.split("/");
              const bucketName = paths[2];
              const folderPath = paths.slice(3).join("/");
              await downloadFolder(bucketName, folderPath, destinationPath);
            } else if (folderData.hasOwnProperty("files")) {
              fs.mkdirSync(destinationPath, { recursive: true });

              await downloadFiles(folderData.files, destinationPath);
            }
          }
        }
      } catch (error) {
        console.error(`Error reading or parsing ${filePath}: ${error.message}`);
        return Promise.reject(error);
      }
    }
  }
}

const startingDirectory = options.directory || process.cwd();
findImagesYmlFiles(startingDirectory)
  .then(() => console.log("Done!"))
  .catch((e) => {
    throw new Error(e);
  });
