import { CSSProperties, ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { Outlet } from 'react-router-dom'

import Header from '@/components/auth/Header/Header'

import s from './layout.module.scss'

import { useMeQuery } from '../../../../services/auth/auth.service'

type Props = {
  marginTopClass?: CSSProperties['marginTop']
} & ComponentPropsWithoutRef<'div'>

// Я хер его знает зачем в forwardRef
export const Layout = forwardRef<ElementRef<'div'>, Props>((props, ref) => {
  const { children, className, ...rest } = props

  // ? Тут в Header и в main нужно передать данные от me запроса.
  const { data: meData, error, isError, isLoading } = useMeQuery()

  console.log(error)
  console.log(isError)
  if (isLoading) {
    return <div>ПОЕШЬ ГОВНА...</div>
  }

  return (
    <div ref={ref} {...rest}>
      <Header isAuth={!!meData} />
      {/*<main className={s.main}>{children}</main>*/}
      <main className={s.main}>
        {/*<Outlet context={!isError} />*/}
        <Outlet />
      </main>
    </div>
  )
})
