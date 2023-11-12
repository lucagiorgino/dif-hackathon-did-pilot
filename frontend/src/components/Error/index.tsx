import { useError } from '@/hooks/useError';
import Alert from 'react-bootstrap/Alert';

export const Error = () => {
    const { error, errorMessage, clearError } = useError()
    return (
      <>
      {
        error 
          &&
        <Alert key='danger' variant='danger' onClick={() => { clearError() }}>
          <strong>Error:</strong> { errorMessage }
        </Alert>
      }
      </>
    )
  }