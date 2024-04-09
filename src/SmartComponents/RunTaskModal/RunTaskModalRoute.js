import React, { useEffect, useState } from 'react';
import { Backdrop, Spinner, Bullseye } from '@patternfly/react-core';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAvailableTask } from '../../../api';
import { dispatchNotification } from '../../Utilities/Dispatcher';
import RunTaskModal from './RunTaskModal';

const RunTaskModalRoute = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState(null);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskData = async () => {
      const task = await fetchAvailableTask(slug);

      if (task?.response?.status && task.response.status !== 200) {
        setError(task);
        dispatchNotification({
          variant: 'danger',
          title: 'Error',
          description: task.message,
          dismissable: true,
          autoDismiss: false,
        });
      } else {
        setTaskData(task);
      }

      setIsFetchingData(false);
    };

    fetchTaskData();
  }, [slug]);

  return isFetchingData ? (
    <Backdrop>
      <Bullseye>
        <Spinner aria-label="Loading task details" />
      </Bullseye>
    </Backdrop>
  ) : (
    <RunTaskModal
      description={taskData?.description}
      error={error}
      isOpen
      parameters={taskData?.parameters}
      selectedSystems={[]}
      setModalOpened={() => navigate('..')}
      slug={taskData?.slug}
      title={taskData?.title}
      filterMessage={taskData?.filter_message}
    />
  );
};

export default RunTaskModalRoute;
