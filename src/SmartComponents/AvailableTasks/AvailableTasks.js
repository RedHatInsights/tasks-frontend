import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { fetchAvailableTasks } from '../../../api';
import CardBuilder, {
  CardBuilderContent,
} from '../../PresentationalComponents/CardBuilder/CardBuilder';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import AvailableTasksTable from './AvailableTasksTable';
import { LOADING_CONTENT } from '../../constants';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import { isError } from '../completedTaskDetailsHelpers';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

export const LoadingTasks = () => {
  const loadingTasks = LOADING_CONTENT;
  return loadingTasks?.map((task, index) => {
    return (
      <React.Fragment key={`loading-${index}`}>
        <CardBuilder>
          <CardBuilderContent
            content={<Skeleton size={SkeletonSize.md} />}
            type="title"
          />
          <CardBuilderContent
            content={<Skeleton size={SkeletonSize.md} />}
            type="body"
          />
          <CardBuilderContent
            content={<Skeleton size={SkeletonSize.md} />}
            type="footer"
          />
        </CardBuilder>
        <br />
      </React.Fragment>
    );
  });
};

const AvailableTasks = ({ openTaskModal }) => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const chrome = useChrome();

  const setTasks = (result) => {
    if (isError(result)) {
      setError(result);
      dispatchNotification({
        variant: 'danger',
        title: 'Error',
        description: result.message,
        dismissable: true,
        autoDismiss: false,
      });
    } else {
      setAvailableTasks(result.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const taskLimit = '?limit=50&offset=0'; // temp workaround for tasks list > 10, eg in stage
      const result = await fetchAvailableTasks(taskLimit);

      setTasks(result);
    };

    fetchData();
  }, []);

  useEffect(() => {
    chrome.updateDocumentTitle('Tasks | Red Hat Insights');
  }, [chrome]);

  return (
    <div aria-label="available-tasks">
      {isLoading ? (
        <LoadingTasks />
      ) : (
        <AvailableTasksTable
          availableTasks={availableTasks}
          error={error}
          openTaskModal={openTaskModal}
        />
      )}
    </div>
  );
};

AvailableTasks.propTypes = {
  openTaskModal: propTypes.func,
};

export default AvailableTasks;
