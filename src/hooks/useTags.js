import { useState, useEffect, useCallback } from 'react';
import { tagsService } from '@api/tags/tags.service';
import { CreateTagDto, UpdateTagDto } from '@api/tags/dto/tag.dto';
import toast from 'react-hot-toast';

export const useTags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTags = useCallback(async () => {
        try {
            setLoading(true);
            const data = await tagsService.getAll();
            setTags(data);
        } catch (error) {
            toast.error("Error loading tags");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const addTag = async (name, color) => {
        try {
            const dto = CreateTagDto(name, color);
            const newTag = await tagsService.create(dto);
            setTags((prev) => [...prev, newTag]);
            toast.success("Tag created successfully");
            return newTag;
        } catch (error) {
            toast.error("Error creating tag");
        }
    };

    const removeTag = async (id) => {
        try {
            await tagsService.delete(id);
            setTags((prev) => prev.filter(tag => tag.id !== id));
            toast.success("Tag removed successfully");
        } catch (error) {
            toast.error("The tag could not be removed. try again later.");
        }
    };

    return { tags, loading, addTag, removeTag, refresh: fetchTags };
};