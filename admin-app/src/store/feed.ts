import { create } from 'zustand'
import { Blog } from '../types/blog'
import { PaginationData } from '../types/pagination'

type FeedStore = {
    feed: Blog[]
    selectedBlogIndex: number,
    selectedBlog: Blog | null,
    feedPagination: PaginationData | null,
    showDrafts: boolean;
    updateFeed: (blogs: Blog[], pagination: PaginationData | null) => void,
    appendFeed: (blogs: Blog[], pagination: PaginationData | null, start?: boolean) => void,
    updateSelectedBlog: (index: number) => void,
    updateBlog: (blog: Blog) => void,
    deleteBlog: (blog: Blog) => void,
    setShowDrafts: (val: boolean) => void,
}

export const useFeedStore = create<FeedStore>()((set) => ({
    feed: [],
    selectedBlogIndex: -1,
    selectedBlog: null,
    feedPagination: null,
    showDrafts: false,
    updateFeed: (blogs: Blog[], pagination: PaginationData | null) => set((state) => ({
        ...state,
        feed: blogs,
        feedPagination: pagination,
    })),
    appendFeed: (blogs: Blog[], pagination: PaginationData | null, start: boolean = false) => set((state) => ({
        ...state,
        feed: start ? [...blogs, ...state.feed] : [...state.feed, ...blogs],
        feedPagination: pagination,
        selectedBlogIndex: start ? state.selectedBlogIndex + 1 : state.selectedBlogIndex,
    })),
    updateSelectedBlog: (index: number) => set((state) => ({
        ...state,
        selectedBlogIndex: index,
        selectedBlog: index >= 0 && index < state.feed.length ? state.feed[index] : null,
    })),
    updateBlog: (blog: Blog) => set((state) => {
        blog.User = state?.selectedBlog?.User ?? { name: '', id: '' };
        const updatedFeed = structuredClone(state.feed);
        updatedFeed[state.selectedBlogIndex] = blog;
        return { ...state, feed: updatedFeed, selectedBlog: state.selectedBlog?.id === blog.id ? blog : state.selectedBlog };
    }),
    deleteBlog: (blog: Blog) => set((state) => {
        const updatedFeed = structuredClone(state.feed).filter((p: Blog) => p.id !== blog.id);
        return {
            ...state,
            feed: updatedFeed,
            selectedBlog: null,
            selectedBlogIndex: -1,
        }
    }),
    setShowDrafts: (val: boolean) => set((state) => ({ ...state, showDrafts: val }))
}))