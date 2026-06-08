import { PageTitle } from '../../../_metronic/layout/core'
import DashboardPage from './DashboardPage'
const DashboardWrapper = () => {
  return (
    <>
      <PageTitle description='' breadcrumbs={[]}>
        Dashboard
      </PageTitle>
      <DashboardPage/>
     </>
  )
}

export {DashboardWrapper}
