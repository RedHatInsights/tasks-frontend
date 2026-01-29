import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
// eslint-disable-next-line rulesdir/disallow-fec-relative-imports
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';
import { fetchAvailableTasks } from '../../../api';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import AvailableTasksTable from './AvailableTasksTable';
import { isError } from '../completedTaskDetailsHelpers';
import { Card, CardBody, CardFooter, CardTitle } from '@patternfly/react-core';

export const LoadingTasks = () => {
  return Array.from({ length: 3 }).map((task, index) => (
    <React.Fragment key={index}>
      <Card key={`loading-${index}`}>
        <CardTitle>
          <Skeleton size={SkeletonSize.md} />
        </CardTitle>
        <CardBody>
          <Skeleton size={SkeletonSize.md} />
        </CardBody>
        <CardFooter>
          <Skeleton size={SkeletonSize.md} />
        </CardFooter>
      </Card>
      <br />
    </React.Fragment>
  ));
};

const AvailableTasks = ({ openTaskModal }) => {
  const addNotification = useAddNotification();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const setTasks = (result) => {
    if (isError(result)) {
      setError(result);
      addNotification({
        variant: 'danger',
        title: 'Error',
        description: result.message,
        dismissable: true,
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
