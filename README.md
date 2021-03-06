# HobbyFarm User Interface

![Main](https://github.com/hobbyfarm/ui/workflows/Main/badge.svg?branch=master)
![docker version latest](https://img.shields.io/docker/v/hobbyfarm/ui?color=green&label=latest%20version&sort=semver)

This is the user interface for HobbyFarm - an interactive learning system.

This is meant to be used in conjunction with github.com/hobbyfarm/gargantua.

## Configuration

A file placed at `/config.json` will allow for runtime configuration (e.g., custom logos, themes, etc.).

```json
{
  "title": "Old MacDonald's Farm",
  "favicon": "<base64-encoded image>",
  "logo": "<base64-encoded image>",
  "eula": "<base64-encoded text>",
  "login": {
    "logo": "<base64-encoded image>",
    "background": "<base64-encoded image>"
  },
  "cssVariables": {
    "clr-header-4-bg-color": "red"
  }
}
```

## Contributing

If you're interested in contributing, see [CONTRIBUTING.md](CONTRIBUTING.md)
