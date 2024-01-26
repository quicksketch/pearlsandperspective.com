# Random Quotes

A simple HTML/CSS/JS application for displaying random quotes.

## Editing Quotes

Open the [`quotes.yml`](quotes.yml) file and add quotes as desired.

Each quote follows a format such as this:

```yml
- quote: "Be the change that you wish to see in the world."
  name: Mahatma Gandhi
  tags:
    - inspirational
    - political
```

Any quote have one or more tags, or none at all. A tag added to any quote will create a category that can be selected from the lower-right of the application when quotes are displayed.

## Editing Images

Add background images to be randomly paired with a quote by uploading to the [`images`](images) directory. Images should be as high-resolution as possible. Generally, darker images (especially in the top-left corner) will display better than light colored images.

## Publishing to GitHub Pages

After any push to the `main` branch, a GitHub Action will automatically execute that publishes the changed files to the generated website. Changes should be published within about 30 seconds. You can view the progress under the "Actions" tab of the repository.

The URL of the website will match the name of the repository. For example if the repository is located at https://github.com/quicksketch/random-quotes, then the published site will be https://quicksketch.github.io/random-quotes. This application can also be published as a profile or organization level site. See https://pages.github.com/ for more information.
