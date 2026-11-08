#!/usr/bin/env python3
"""Launch the reviewed host-pinned Begin core; never choose a legacy runner."""
import hashlib
import json
import os
from pathlib import Path
import stat
import sys


def sha256(filename):
    result = hashlib.sha256()
    with open(filename, 'rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(block)
    return result.hexdigest()


def launch():
    pointer = Path.home() / '.config/tctbp-begin/current.json'
    info = pointer.lstat()
    if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid() or info.st_mode & 0o077:
        raise ValueError('The installed Begin pointer is not a private owned regular file.')
    config = json.loads(pointer.read_text())
    if config.get('schemaVersion') != 1:
        raise ValueError('Unsupported installed Begin pointer.')
    node, manifest = Path(config['node']), Path(config['manifest'])
    if not node.is_absolute() or node.resolve() != node or sha256(node) != config['nodeSha256']:
        raise ValueError('The selected Node runtime changed; review and repin it before Begin.')
    if not manifest.is_absolute() or manifest.resolve() != manifest or sha256(manifest) != config['manifestSha256']:
        raise ValueError('The installed Begin release changed; inspect its rollout receipt.')
    release = json.loads(manifest.read_text())
    if release.get('contract') != 'tctbp-begin/1' or release.get('coreRelease') != config['coreRelease']:
        raise ValueError('The installed Begin contract/release does not match its pin.')
    root = manifest.parent
    for relative, expected in release['files'].items():
        file = root / relative
        if not file.is_absolute() or file.resolve() != file or root not in file.parents or sha256(file) != expected:
            raise ValueError('Installed Begin files differ from the reviewed release.')
    cli = root / 'core/cli.cjs'
    if 'core/cli.cjs' not in release['files']:
        raise ValueError('The installed release has no shared Begin entry.')
    os.execv(str(node), [str(node), str(cli), *sys.argv[1:]])


if __name__ == '__main__':
    try:
        launch()
    except (OSError, ValueError, KeyError, TypeError):
        print(json.dumps({'contract': 'tctbp-begin/1', 'state': 'BLOCKED', 'handoffComplete': False,
                          'reason': 'The host-pinned shared Begin runtime is unavailable or changed; inspect the installation before continuing.'}))
        sys.exit(1)
