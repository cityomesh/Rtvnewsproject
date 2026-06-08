import { Logout } from '../../../../app/modules/auth/components/Logout'
import {KTIcon} from '../../../helpers'
import {Search, ThemeModeSwitcher} from '../../../partials'

const Topbar = () => {
  return (
    <div className='d-flex align-items-center flex-shrink-0 justify-content-center'>




      {/* begin::Theme mode */}
      <div className={'d-flex align-items-center ms-3 ms-lg-4 justify-content-center'}>
        <Logout />
        {/* <ThemeModeSwitcher toggleBtnClass='btn-color-gray-700 btn-active-color-primary btn-outline w-40px h-40px mx-8' /> */}
      </div>
      {/* end::Theme mode */}
    </div>
  )
}

export {Topbar}
