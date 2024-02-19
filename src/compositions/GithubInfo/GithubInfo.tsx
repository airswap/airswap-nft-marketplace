import { FC, ReactElement } from 'react';

import Icon from '../../components/Icon/Icon';

import './GithubInfo.scss';

const githubLink = 'https://github.com/airswap/airswap-marketplace';
const githubLastCommitIdFallback = 'DEV';
const githubLastCommitId = process.env.BUILD_VERSION;
const commitDate = process.env.BUILD_DATE;
const readableCommitId = githubLastCommitId
    ? githubLastCommitId.substr(0, 6)
    : undefined;
const readableCommitDate = commitDate ? commitDate.substr(0, 10) : undefined;
const commitLink = githubLastCommitId === githubLastCommitIdFallback
        ? `${githubLink}/commits`
        : `${githubLink}/commit/${githubLastCommitId}`;

interface GithubInfoProps {
  className?: string;
}

const GithubInfo: FC<GithubInfoProps> = ({ className = '' }): ReactElement => (
  <div className={`github-info ${className}`}>
    <a
      target="_blank"
      aria-label="github"
      rel="noreferrer noopener"
      href={githubLink}
      className="github-info__github-link"
    >
      <Icon name="github" />
    </a>

    {githubLastCommitId && (
      <a
        target="_blank"
        aria-label="Latest Github commit"
        href={commitLink}
        rel="noreferrer"
        className="github-info__commit-link"
      >
        {readableCommitId}
      </a>
    )}

    {commitDate && (
      <a
        target="_blank"
        aria-label="Latest Github commit"
        href={commitLink}
        rel="noreferrer"
        className="github-info__date-link"
      >
        {readableCommitDate}
      </a>
    )}
  </div>
);

export default GithubInfo;
