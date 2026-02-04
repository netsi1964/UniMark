# Release

Releases laves via GitHub Actions workflow. Gamle releases bliver liggende.

## Forudsætninger

```bash
gh auth status  # Skal være autentificeret
```

## Lav ny release

```bash
gh workflow run release.yml -f version=v0.1.0
```

## Følg status

```bash
gh run list --workflow=release.yml --limit=1
gh run watch  # Live status (blokerer)
```

## Find release

```bash
gh release list
gh release view v0.1.0
gh release view v0.1.0 --web  # Åbn i browser
```
