# Dotfiles

This is a [Chezmoi](https://github.com/twpayne/chezmoi) managed dotfiles repository.

## Quick Start

### Install chezmoi and apply dotfiles on a new machine

```sh
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply prnk28
```

For transitory environments (containers, etc.):

```sh
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --one-shot prnk28
```

## Daily Operations

### Edit your dotfiles

Edit a dotfile with:

```sh
chezmoi edit $FILENAME
```

Auto-apply when you quit your editor:

```sh
chezmoi edit --apply $FILENAME
```

Auto-apply when you save the file:

```sh
chezmoi edit --watch $FILENAME
```

### Pull and apply latest changes

```sh
chezmoi update
```

### Preview changes before applying

```sh
chezmoi git pull -- --autostash --rebase && chezmoi diff
```

If you're happy with the changes:

```sh
chezmoi apply
```

### Auto-commit and push changes

Add to `~/.config/chezmoi/chezmoi.toml`:

```toml
[git]
    autoCommit = true
    autoPush = true
```

With custom commit message prompt:

```toml
[git]
    autoCommit = true
    commitMessageTemplate = "{{ promptString \"Commit message\" }}"
```

## Basic Commands

### Install

```sh
chezmoi install
```

### Update

```sh
chezmoi update
```

### Uninstall

```sh
chezmoi uninstall
```

## License

[MIT](LICENSE)
