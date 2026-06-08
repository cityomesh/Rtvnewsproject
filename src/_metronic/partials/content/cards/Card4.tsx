
import {FC} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'

type Props = {
  icon: string
  title: string
  description: string,
  button1?: ()=>void|null,
  button2?: ()=>Promise<void>|null,
  b1Icon?: string,
  b2Icon?: string
}

const Card4: FC<Props> = ({icon, title, description,
  button1=null,
  button2=null,
  b1Icon='pencil',
  b2Icon='trash'
}) => {
  return (
    <div className='card h-100'>
      <div className='card-body d-flex justify-content-center text-center flex-column p-8'>
        <a href='#' className='text-gray-800 text-hover-primary d-flex flex-column'>
          <div className='symbol symbol-75px mb-6'>
            <img src={icon} alt='' />
          </div>
          <div className='fs-5 fw-bolder mb-2'>{title}</div>
        </a>
        <div className='fs-7 fw-bold text-gray-500 mt-auto'>{description}</div>
        <div className='d-flex justify-content-evenly mt-2'>
          {button1 && <a onClick={button1} className="btn">
              <KTIcon iconName={b1Icon} className='fs-2 text-primary'/>
            </a>}
          {button2 && <a onClick={button2} className="btn">
            <KTIcon iconName={b2Icon} className='fs-2 text-danger'/>
          </a>}
        </div>
      </div>
    </div>
  )
}

export {Card4}
