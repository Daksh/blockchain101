# Blockchain 101 @Facebook DevC

Slides: https://uri.im/ethppt

Speaker: Shubhamoy ([GitHub](https://github.com/shubhamoy))

Linting is essential when you are writing such code, as there was an instance of [DAO Attack](https://www.coindesk.com/dao-attacked-code-issue-leads-60-million-ether-theft/) which caused a theft of millions. As the contracts are publically available, it is easy for attackers to find potential vulnerabilities.

## Linting Output
```
daksh@Dakshs-MacBook-Air  ~/Desktop/blockchain101   master  npm i -g solium
/usr/local/bin/solium -> /usr/local/lib/node_modules/solium/bin/solium.js

> fsevents@1.2.4 install /usr/local/lib/node_modules/solium/node_modules/fsevents
> node install

[fsevents] Success: "/usr/local/lib/node_modules/solium/node_modules/fsevents/lib/binding/Release/node-v64-darwin-x64/fse.node" already installed
Pass --update-binary to reinstall or --build-from-source to recompile
+ solium@1.1.8
added 331 packages from 423 contributors in 14.673s
 daksh@Dakshs-MacBook-Air  ~/Desktop/blockchain101   master  solium --init
 daksh@Dakshs-MacBook-Air  ~/Desktop/blockchain101   master ●  solium --file contracts/SmartWallet.sol

contracts/SmartWallet.sol
  20:8     warning    Provide an error message for require().                             error-reason
  24:23    warning    Visibility modifier "public" should come before other modifiers.    visibility-first
  25:8     warning    Provide an error message for require().                             error-reason
  40:8     error      Avoid using Inline Assembly.                                        security/no-inline-assembly
  57:12    warning    Provide an error message for revert().                              error-reason

✖ 1 error, 4 warnings found.

 ✘ daksh@Dakshs-MacBook-Air  ~/Desktop/blockchain101   master ●  git status
On branch master
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)

	.soliumignore
	.soliumrc.json

no changes added to commit (use "git add" and/or "git commit -a")
```

## Useful links
* Smart Wallet Contract [Barebone](https://gist.github.com/shubhamoy/d67f2efc905a4d27cb1bbc3b9f6aa29d)
* [Final Version](https://gist.github.com/shubhamoy/df90a2d53e75e98c4c73130fd29e6cd5) of Contract
* [Migration Script](https://gist.github.com/shubhamoy/3ef772e852f64913b37ffc548230e286)

## Misc Learnings

* Nice URL Shortener: https://uri.im/