---
title: "Speeding Up Hugo Builds with GitHub Actions Caching"
date: 2025-07-20T12:29:44+05:30
draft: false
---

# Speeding Up Hugo Builds with GitHub Actions Caching

This blog runs on Hugo. To add images to blog posts, I was previously committing them directly into git. This approach becomes painful over time and increases the repository size, eventually becoming a limiting factor.

Last year, I solved this by adding a Node script that downloads all the files mentioned inside `**/images.yml` files:

```
Chennai_2:
  files:
    - s3://rohit-images/web/2023-08-06_F10_K400_D76/20230806_K400_D76_01.jpg
    - s3://rohit-images/web/2023-08-06_F10_K400_D76/20230806_K400_D76_02.jpg
    - s3://rohit-images/web/2023-08-06_F10_K400_D76/20230806_K400_D76_03.jpg
```

The script creates a folder in the same directory as `images.yml`, which is then referenced in the markdown files. The S3 bucket is protected, ensuring secure access to the images.

Once the images are downloaded by the script, Hugo builds the site and then deploys it.

## The Problem

The issue I've been facing recently is that builds take a long time because the script downloads many files. This build time is particularly painful because every time I make any edit, I need to wait around 10 minutes for the build to complete.

I've been thinking of various ways to solve this, including wanting to code my own blogging platform, which I still want to do, and explore the "Blog-as-Social-Media" concept I've been considering.

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

Test 1:
This post serves as a test to see if this approach will work effectively.
Expectations:

1. With no new `images.yml`, build should be fast.

Edit:
Looks like it worked.
{{<figure src="/post/optimizing-build-times/Optimizing-Build-Times/ksnip_20250720-125230.png">}}

Test 2:
Now, checking if adding a new `images.yml` will work.
Expectations:

1. All previously downloaded files should not be re downloaded
2. New files from new `images.yml` file should be downloaded.
