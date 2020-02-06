import PropTypes from 'prop-types';
import React from 'react';
import {Release} from '@sentry/release-parser';
import styled from '@emotion/styled';

import GlobalSelectionLink from 'app/components/globalSelectionLink';
import Link from 'app/components/links/link';
import Tooltip from 'app/components/tooltip';
import {IconCopy} from 'app/icons';
import Clipboard from 'app/components/clipboard';
import overflowEllipsis from 'app/styles/overflowEllipsis';
import space from 'app/styles/space';

type Props = {
  version: string;
  anchor?: boolean;
  orgId?: string;
  /**
   * Should link to Release preserve user's global selection values
   */
  preserveGlobalSelection?: boolean;
  tooltipRawVersion?: boolean;
  /**
   * Will add project project ID to the linked url
   */
  projectId?: string;
  className?: string;
  truncate?: boolean;
};

const Version = ({
  version,
  orgId,
  anchor = true,
  preserveGlobalSelection,
  tooltipRawVersion,
  projectId,
  className,
  truncate,
}: Props) => {
  const parsedVersion = new Release(version);
  const LinkComponent = preserveGlobalSelection ? GlobalSelectionLink : Link;

  const renderVersion = () => {
    if (anchor && orgId) {
      return (
        <LinkComponent
          to={{
            pathname: `/organizations/${orgId}/releases/${encodeURIComponent(
              parsedVersion.raw
            )}/`,
            query: {project: projectId},
          }}
          className={className}
        >
          <VersionText truncate={truncate}>{parsedVersion.describe()}</VersionText>
        </LinkComponent>
      );
    }

    return (
      <VersionText className={className} truncate={truncate}>
        {parsedVersion.describe()}
      </VersionText>
    );
  };

  const renderTooltipContent = () => {
    return (
      <TooltipContent
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <TooltipVersionWrapper>{parsedVersion.raw}</TooltipVersionWrapper>

        <Clipboard value={parsedVersion.raw}>
          <TooltipClipboardIconWrapper>
            <IconCopy size="xs" color="white" />
          </TooltipClipboardIconWrapper>
        </Clipboard>
      </TooltipContent>
    );
  };

  return (
    <Tooltip title={renderTooltipContent()} disabled={!tooltipRawVersion} isHoverable>
      {renderVersion()}
    </Tooltip>
  );
};

Version.propTypes = {
  version: PropTypes.string.isRequired,
  orgId: PropTypes.string,
  anchor: PropTypes.bool,
  /**
   * Should link to Release preserve user's global selection values
   */
  preserveGlobalSelection: PropTypes.bool,
  tooltipRawVersion: PropTypes.bool,
  className: PropTypes.string,
  projectId: PropTypes.string,
  truncate: PropTypes.bool,
};

const VersionText = styled('span')<{truncate?: boolean}>`
  ${p =>
    p.truncate &&
    `max-width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;`}
`;

const TooltipContent = styled('span')`
  display: flex;
  align-items: center;
`;

const TooltipVersionWrapper = styled('span')`
  ${overflowEllipsis}
`;

const TooltipClipboardIconWrapper = styled('span')`
  margin-left: ${space(0.5)};
  position: relative;
  bottom: -${space(0.25)};

  &:hover {
    cursor: pointer;
  }
`;

export default Version;
