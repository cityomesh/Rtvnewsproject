import {FC, useState} from 'react'
import {KTIcon} from '../../../_metronic/helpers'
import {ITeam} from "./team.tsx";


type Props = {
  team: ITeam,
  button1?: () => void | null,
  button2?: () => Promise<void> | null,
  b1Icon?: string,
  b2Icon?: string
}



const TeamCard: FC<Props> = ({
                               team,
                               button1 = null,
                               button2 = null,
                               b1Icon = 'pencil',
                               b2Icon = 'trash'
                             }) => {
  return (

    <>
      <div className='card h-100 mt-7 d-flex' style={{backgroundColor:'white', borderRadius: '25px', border: `10px solid ${team.teamThemeColor}`}}>
        <div className='' style={{ flex: '7'}}>
          <div className='card-body d-flex justify-content-center text-center flex-column p-4'>
            <a href='#' className='text-gray-800 d-flex flex-column'>
              <div className='symbol symbol-100px mb-2'>
                <img src={team.teamLogo} alt=''/>
              </div>
              <div className='fs-5 fw-bolder text-black mb-2'>{team.teamName}</div>
            </a>
            <div className='fs-7 fw-bold text-gray-500 mt-auto'>{team.teamState}</div>
        </div>

        <div className='d-flex justify-content-center align-items-center' style={{borderRadius: '0px 0px 10px 10px', flex: '3', height: '15%'}}>
          <div className='d-flex justify-content-evenly mt-1 align-items-center' style={{ marginTop: '30px' }}>
            {button1 && <a onClick={button1} className="btn btn-bg-light btn-color-primary" style={{ marginRight: '8%', marginLeft: '-4%', background: '#e6e2e2'}}>
              <KTIcon iconName={b1Icon} className='fs-2 text-primary'/>
            </a>}
            {button2 && <a onClick={button2} className="btn btn-bg-light btn-color-danger" style={{ marginRight: '8%', background: '#e6e2e2'}}>
              <KTIcon iconName={b2Icon} className='fs-2 text-danger'/>
            </a>}
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export {TeamCard}
