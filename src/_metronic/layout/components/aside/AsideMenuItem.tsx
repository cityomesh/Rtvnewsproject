/* eslint-disable @typescript-eslint/ban-types */
import React from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {KTIcon, WithChildren} from '../../../helpers'
import {useLayout} from '../../core'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  setToggle: (path: string) => void
  basePath?: string
}

const AsideMenuItem: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  setToggle,
  basePath = '',
}) => {
  const {pathname} = useLocation()
  const isActive = pathname === to
  const {config} = useLayout()
  const {aside} = config

  const handleClick = () => {
    const currentPath = `${basePath}/${title}`
    setToggle(currentPath)
  }

  return (
    <div className='menu-item' style={{paddingLeft: '20px'}}>
      <Link className={clsx('menu-link', {active: isActive})} to={to} onClick={handleClick}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && aside.menuIcon === 'svg' && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-5' />
          </span>
        )}
        <span className='menu-title'>{title}</span>
      </Link>
      {children}
    </div>
  )
}

export {AsideMenuItem}