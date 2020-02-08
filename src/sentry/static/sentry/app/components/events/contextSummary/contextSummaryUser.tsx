import React from 'react';

import {objectIsEmpty} from 'app/utils';
import {AvatarUser} from 'app/types';
import UserAvatar from 'app/components/avatar/userAvatar';
import {t} from 'app/locale';
import {removeFilterMaskedEntries} from 'app/components/events/interfaces/utils';
import ContextSummaryNoSummary from './contextSummaryNoSummary';
import ContextSummaryInfo from './contextSummaryInfo';

type Props = {
  data: AvatarUser;
};

enum userTitleType {
  EMAIL = 'email',
  IP_ADDRESS = 'ip_address',
  ID = 'id',
  USERNAME = 'username',
}

const ContextSummaryUser = ({data}: Props) => {
  const user: AvatarUser = removeFilterMaskedEntries(data);

  if (objectIsEmpty(user)) {
    return <ContextSummaryNoSummary title={t('Unknown User')} />;
  }

  const userTitleTypes = Object.keys(userTitleType);

  const userTitle = Object.keys(user).find(userDetail =>
    userTitleTypes.includes(userDetail)
  );

  if (!userTitle) {
    return <ContextSummaryNoSummary title={t('Unknown User')} />;
  }

  const renderUserDetails = () => {
    if (user.id && user.id !== user[userTitle]) {
      return <ContextSummaryInfo subject={t('ID:')} obj={user} objKey="id" />;
    }

    if (user.username && user.username !== user[userTitle]) {
      return <ContextSummaryInfo subject={t('Username:')} obj={user} objKey="username" />;
    }

    return null;
  };

  return (
    <div className="context-item user">
      {userTitle ? (
        <UserAvatar
          user={user}
          size={48}
          className="context-item-icon"
          gravatar={false}
        />
      ) : (
        <span className="context-item-icon" />
      )}
      {user[userTitle] && <h3 data-test-id="user-title">{user[userTitle]}</h3>}
      {renderUserDetails()}
    </div>
  );
};

export default ContextSummaryUser;
