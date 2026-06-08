
import { FC } from 'react'
import { useListView } from '../../../../app/modules/apps/user-management/users-list/core/ListViewProvider'
import { KTIcon } from '../../../helpers'

type Props = {
    header: string
    toggleModal: ()=>void
  }


const ModalHeader: FC<Props> = ({header, toggleModal}) => {
  const {setItemIdForUpdate} = useListView()

  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>{header}</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={toggleModal}
        style={{cursor: 'pointer'}}
      >
        <KTIcon iconName='cross' className='fs-1' />
      </div>
      {/* end::Close */}
    </div>
  )
}

export {ModalHeader}
