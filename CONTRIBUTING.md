# Contributing to TrueTone AI

First off, thank you for considering contributing to TrueTone AI! It's people like you that make TrueTone AI such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) to see if someone else has already created an issue for it. If not, go ahead and [make one](../../issues/new)!

## Fork & create a branch

If this is something you think you can fix, then [fork TrueTone AI](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-color-palette
```

## Get the test suite running

Make sure to install all dependencies and ensure the project builds correctly.
Please refer to the `README.md` for getting the local development environment set up.

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with TrueTone AI's master branch:

```sh
git remote add upstream git@github.com:khushiiesss/TrueTone.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-new-color-palette
git rebase master
git push --set-upstream origin 325-add-new-color-palette
```

Finally, go to GitHub and [make a Pull Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) :D

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
