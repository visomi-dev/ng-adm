#!/usr/bin/env bun

const branchPattern =
  /^(feat|fix|refactor|hotfix|reformat|optimise|enhance|ci|docs)\/[A-Z]{2,4}-\d+\/.+$/i;
const mainBranch = 'main';
const developBranch = 'develop';

const branchName = process.argv[2];

if (!branchName) {
  console.log('branch name is required');

  process.exit(1);
}

if (
  branchPattern.test(branchName) ||
  branchName === mainBranch ||
  branchName === developBranch
) {
  process.exit(0);
}

console.log('Wrong branch name!');
console.log('The branch name must have this format:');
console.log('<verb>/<developer-initials>-<issue-id>/<what-was-done>');
console.log(
  'Allowed verbs: feat | fix | refactor | hotfix | reformat | optimise | enhance | merge | ci | docs',
);
console.log('Example:');
console.log('feat/MVS-1234/add-new-feature');
console.log('-');
console.log('Your branch name was:');
console.log(branchName);
console.log('-');
console.log('For more information, check script in ./bin/branchlint');
console.log('-');

process.exit(1);
