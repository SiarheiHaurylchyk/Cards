import { ChangeEvent, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import groupIcon from '@/assets/icons/WhiteSVG/Group 1399.svg'
import menuIcon2 from '@/assets/icons/WhiteSVG/edit-2-outline.svg'
import headerIcon from '@/assets/icons/WhiteSVG/person-outline.svg'
import menuIcon from '@/assets/icons/WhiteSVG/trash-outline.svg'
import ArrowBackOutline from '@/assets/icons/svg/ArrowBackOutline'
import DropdownMenuDemo from '@/components/ui/DropDown/DropDown'
import DropDownItem from '@/components/ui/DropDown/DropDownItem'
import Input from '@/components/ui/Input/Input'
import { PaginationWithSelect } from '@/components/ui/Pagination/PaginationWithSelect'
import Typography from '@/components/ui/Typography/Typography'
import { Button } from '@/components/ui/button'
import { ModalAddEditCard } from '@/pagesMinin/ModalsForTable/ModalEditCard/ModalAddEditCard'
import { SingleRowCard } from '@/pagesMinin/TableComponent/SingleRowCard/SingleRowCard'
import { TableComponentWithTypes } from '@/pagesMinin/TableComponent/TableComponentWithTypes'
import { Page } from '@/pagesMinin/componentsMinin/Page/Page'
import { useQueryParams } from '@/pagesMinin/utls/useQueryParams'
import {
  headersNameCards,
  initCurrentPage,
  selectOptionPagination,
} from '@/pagesMinin/utls/variablesMinin'
import { clsx } from 'clsx'

import s from './cardsPage.module.scss'

import { useMeQuery } from '../../services/auth/auth.service'
import { useGetCardsQuery } from '../../services/cards/cards.service'
import { useGetDeckByIdQuery } from '../../services/decks/decks.service'

export const CardsPage = () => {
  const {
    currentOrderBy,
    currentPage,
    itemsPerPage,
    search,
    setCurrentPageQuery,
    setItemsPerPageQuery,
    setSearchQuery,
  } = useQueryParams()

  const [open, setOpen] = useState(false)

  // Когда переходим на эту страницу, то переходим по Deck ID,
  // то есть ID можем взять из URL, значит можно использовать хук useParams

  // А как мы попадем на эту страницу??? -- по Id Deck. Значит id Deck нужно передать в URL при переходе.
  const deckId = useParams().deckId
  const { data: meData } = useMeQuery()
  const { data: deck, isLoading } = useGetDeckByIdQuery({ id: deckId ?? '' })

  const { currentData, data } = useGetCardsQuery({
    args: { currentPage, itemsPerPage, orderBy: currentOrderBy, question: search },
    id: deckId ?? '',
  })

  const handleItemsPerPageChange = (value: number) => {
    setCurrentPageQuery(Number(initCurrentPage))
    setItemsPerPageQuery(value)
  }
  const handleCurrentPageChange = (value: number) => {
    setCurrentPageQuery(value)
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPageQuery(Number(initCurrentPage))
    setSearchQuery(e.currentTarget.value)
  }

  const cardsData = currentData ?? data
  const isCardsCountFilled = deck?.cardsCount !== 0

  if (isLoading) {
    return <h1>...Loading</h1>
  }

  return (
    <Page className={s.common} mt={'24px'}>
      <ModalAddEditCard open={open} setOpen={setOpen} />
      <div className={s.heading}>
        <div className={s.headingFirstRow}>
          <Typography as={Link} style={{ textDecoration: 'none' }} to={'/'} variant={'body2'}>
            <ArrowBackOutline className={s.backIcon} />
            Back to Deck List
          </Typography>
        </div>
        <div className={s.headingSecondRow}>
          <div className={clsx(deck?.cover && s.isWithImage)}>
            <div className={s.info}>
              <Typography as={'h1'} variant={'h1'}>
                {deck?.name}
              </Typography>
              {deck?.userId === meData?.id && deck?.cardsCount !== 0 && (
                // В DropDownItem можно передать onClick? Если нет, то обернуть в Button
                <DropdownMenuDemo icon={groupIcon} type={'menu'}>
                  <DropDownItem icon={menuIcon} text={'Learn'} />
                  <DropDownItem icon={headerIcon} text={'Edit'} />
                  <DropDownItem icon={menuIcon2} text={'Delete'} />
                </DropdownMenuDemo>
              )}
            </div>
            {isCardsCountFilled && deck?.cover && (
              <img alt={'img'} src={deck?.cover} width={'200px'} />
            )}
          </div>
          {isCardsCountFilled && (
            <div className={s.switchButton}>
              {deck?.userId === meData?.id ? (
                <Button className={s.addCard} onClick={() => setOpen(true)} type={'button'}>
                  <Typography variant={'subtitle2'}>Add New Card</Typography>
                </Button>
              ) : (
                <Button
                  as={Link}
                  className={s.learnCards}
                  onClick={() => setOpen(true)}
                  to={`/decks/${deckId}/card`}
                  type={'button'}
                >
                  <Typography variant={'subtitle2'}>Learn Cards</Typography>
                </Button>
              )}
            </div>
          )}
        </div>
        {isCardsCountFilled && (
          <Input
            callback={setSearchQuery}
            className={s.input}
            onChange={handleSearch}
            // querySearch={search}
            type={'search'}
            value={search}
          />
        )}
      </div>
      {deck?.cardsCount === 0 ? (
        <div className={s.emptyContent}>
          <Typography variant={'body1'}>
            This deck is empty. Click add new card to fill this pack
          </Typography>
          <Button className={s.addCard} onClick={() => setOpen(true)} type={'button'}>
            <Typography variant={'subtitle2'}>Add New Card</Typography>
          </Button>
        </div>
      ) : (
        <>
          <TableComponentWithTypes data={cardsData?.items} tableHeader={headersNameCards}>
            {item => <SingleRowCard item={item} />}
          </TableComponentWithTypes>
          <div className={s.footer}>
            <PaginationWithSelect
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              selectOptions={selectOptionPagination}
              setCurrentPage={handleCurrentPageChange}
              setItemsPerPage={handleItemsPerPageChange}
              totalItems={cardsData?.pagination.totalItems || 0}
            />
          </div>
        </>
      )}
    </Page>
  )
}