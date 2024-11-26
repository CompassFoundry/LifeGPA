import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ hasReportCard, children, onboardingPath }) => {
  if (hasReportCard) {
    return children
  } else {
    return <Navigate to={onboardingPath} />
  }
}

export default PrivateRoute
