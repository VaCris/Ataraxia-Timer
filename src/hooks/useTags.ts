import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { RootState } from '@store/index'
import * as actions from '@store/slices/tagsSlice'
import { CreateTagDto, UpdateTagDto } from '@api/tags/dto/tag.dto'

export const useTags = () => {
  const dispatch = useDispatch()
  const { items, loading } = useSelector((s: RootState) => s.tags)

  useEffect(() => {
    dispatch(actions.fetchTagsRequest())
  }, [dispatch])

  const addTag = (data: CreateTagDto) => dispatch(actions.addTagRequest(data))
  const updateTag = (id: string, data: UpdateTagDto) =>
    dispatch(actions.updateTagRequest({ id, data }))
  const removeTag = (id: string) => dispatch(actions.deleteTagRequest(id))

  return { tags: items, loading, addTag, updateTag, removeTag }
}