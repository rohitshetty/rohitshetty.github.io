---
title: "Speeding Up Hugo Builds with GitHub Actions Caching"
date: 2025-07-20T22:03:44+05:30
draft: false
---

This blog is built with Hugo. To add images to blog posts, I previously committed them directly to git. This approach becomes painful over time and increases the repository size, eventually becoming a limiting factor.

Last year, I solved this by adding a Node script that downloads all files mentioned in `**/images.yml` files. Each blog post that needs images should have an `images.yml` file:

```yaml
Chennai_2:
  files:
    - s3://rohit-images/web/2023-08-06_F10_K400_D76/20230806_K400_D76_01.jpg
    - s3://rohit-images/web/2023-08-06_F10_K400_D76/20230806_K400_D76_02.jpg
    - s3://rohit-images/web/2023-08-06_F10_K400_D76/20230806_K400_D76_03.jpg
```

The [script](https://github.com/rohitshetty/rohitshetty.github.io/blob/main/scripts/index.js) creates a folder and downloads the files from S3 to the same directory as `images.yml`, which are then referenced in the markdown files.
The S3 bucket is protected, ensuring secure access to images only through tightly scoped IAM credentials used at build time.

Once the images are downloaded by the script, Hugo builds the site and deploys it.
You can find the source for this blog [here](https://github.com/rohitshetty/rohitshetty.github.io).

## The Problem

The issue I've been facing recently is that builds take a long time because the script downloads many files. This build time is particularly painful because every time I make any edit, I need to wait around 10 minutes for the build to complete.

I've been thinking of various ways to solve this, including coding my own blogging platform, which I still want to do, and exploring the "Blog-as-Social-Media" concept I've been considering.

## A Temporary Solution

However, as a temporary stopgap solution, I'm now testing adding a cache to my GitHub build workflow:

```yaml
- name: Restore image cache
  id: cache-images
  uses: actions/cache@v3
  with:
    # All downloaded images live inside the content directory
    path: |
      content
    # Cache key changes when any images.yml file is modified
    key: images-${{ runner.os }}-${{ hashFiles('**/images.yml') }}
    # Fallback to the most recent cache even if the hash changes
    restore-keys: |
      images-${{ runner.os }}-
```

My script already includes a flag that skips downloading files if they already exist. This feature, combined with the caching above, should hopefully make builds significantly faster.

## Testing the Solution

**Test 1: Basic Caching**

To validate this approach, I first tested whether builds would be faster with no new `images.yml` changes. My hypothesis was that with no changes to `images.yml`, the build should be fast.

The test was successful, as shown in the screenshot below:

{{<figure src="/post/optimizing-build-times/Optimizing-Build-Times/ksnip_20250720-125230.png">}}

**Test 2: Adding New Images**

Next, I tested adding a new `images.yml` file to see if the caching would work correctly. I expected that:

1. All previously downloaded files should not be re-downloaded
2. New files from the new `images.yml` file should be downloaded

This test also worked as expected:

{{<figure src="/post/optimizing-build-times/Optimizing-Build-Times/ksnip_20250720-132244.png">}}

I accidentally committed the image files because .gitignore wasn't set up to ignore .png files. I added that rule. Because of this, the initial download didn't happen.

I updated the .gitignore rule and then removed the files with `git rm`. The process worked correctly.

**Test 3: Modifying Existing Images**

I added a new file to an existing `images.yml`. I expected that:

1. All previously downloaded images should continue to exist and speed up the build
2. The new file should be downloaded

This test failed. Because the caching was applied to the entire content folder, even the `index.md` and `images.yml` files got overwritten by the cached version. This meant I couldn't update any old content or fix typos.

I updated the rule to cache only image files:

```yaml
- name: Restore image cache
  id: cache-images
  uses: actions/cache@v3
  with:
    # Cache only downloaded image files, not content files
    path: |
      content/**/images/
      content/**/*.jpg
      content/**/*.jpeg
      content/**/*.png
      content/**/*.gif
      content/**/*.webp
    # Cache key changes when any images.yml file is modified
    key: images-v2-${{ runner.os }}-${{ hashFiles('**/images.yml') }}
    # Fallback to the most recent cache even if the hash changes
    restore-keys: |
      images-v2-${{ runner.os }}-
```

**Test 4: Final Validation**

With the updated caching configuration, I expected that:

1. The first build should take longer and re-download everything
2. Subsequent builds should only download new/edited files, even if `images.yml` is updated

The results were promising:

{{<figure src="/post/optimizing-build-times/Optimizing-Build-Times/ksnip_20250720-212428.png">}}

Running the job again worked perfectly—the runtime was significantly reduced. The first run downloaded all files, while the second reused them from the cache.

To confirm the second expectation, I ran the job again:

{{<figure src="/post/optimizing-build-times/Optimizing-Build-Times/ksnip_20250720-213411.png">}}

Perfect! It downloaded only the new file and reused the previously cached files.
