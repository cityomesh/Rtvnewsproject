
import React from 'react'
import clsx from 'clsx'
import {useLocation} from 'react-router'
import {checkIsActive, KTIcon, WithChildren} from '../../../helpers'
import {useLayout} from '../../core'

type Props = {
  to: string
  title: string
  icon?: string
  iconExpanded?: string
  fontIcon?: string
  hasBullet?: boolean
  toggle: string
  setToggle: (path: string) => void
  noSubs?: boolean
  basePath?: string
}

const AsideMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  iconExpanded = 'black-down',
  fontIcon,
  hasBullet,
  toggle,
  setToggle,
  noSubs = false,
  basePath = '',
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)
  const {config} = useLayout()
  const {aside} = config

  const currentPath = basePath ? `${basePath}/${title}` : title
  const isExpanded = !noSubs && toggle.startsWith(currentPath)

  const handleClick = () => {
    if (noSubs) {
      setToggle(currentPath)
    } else {
      setToggle(isExpanded ? basePath : currentPath)
    }
  }

  const childrenWithBasePath = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {basePath: currentPath})
    }
    return child
  })

  return (
    <div className={clsx('menu-item', 'menu-accordion', {'here show': isActive || isExpanded})}>
      <div className='menu-link' onClick={handleClick} style={{cursor: 'pointer'}}>
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && aside.menuIcon === 'svg' && (
          <span className='menu-icon'>
            <KTIcon iconName={isExpanded ? iconExpanded : icon} className='fs-2' />
          </span>
        )}
        {fontIcon && aside.menuIcon === 'font' && <i className={clsx('bi fs-3', fontIcon)}></i>}
        <span className='menu-title'>{title}</span>
        {!noSubs && <span className='menu-arrow'></span>}
      </div>
      <div
        className={clsx('menu-sub menu-sub-accordion', {'menu-active-bg': isActive})}
        style={{paddingLeft: '20px'}}
      >
        {childrenWithBasePath}
      </div>
    </div>
  )
}

export {AsideMenuItemWithSub}