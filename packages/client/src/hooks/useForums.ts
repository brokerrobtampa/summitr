import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as forumsApi from '../api/forums.api.js';

export function useForumCategories() {
  return useQuery({
    queryKey: ['forums', 'categories'],
    queryFn: () => forumsApi.getCategories(),
  });
}

export function useContinentCategories() {
  return useQuery({
    queryKey: ['forums', 'continents'],
    queryFn: () => forumsApi.getContinentCategories(),
  });
}

export function usePeakCategory(peakId: number) {
  return useQuery({
    queryKey: ['forums', 'peak-category', peakId],
    queryFn: () => forumsApi.getPeakCategory(peakId),
    enabled: !!peakId,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['forums', 'category', slug],
    queryFn: () => forumsApi.getCategoryBySlug(slug),
    enabled: !!slug,
  });
}

export function useForumThreads(categoryId: number, page = 1) {
  return useQuery({
    queryKey: ['forums', 'threads', categoryId, page],
    queryFn: () => forumsApi.getThreads(categoryId, page),
    enabled: !!categoryId,
  });
}

export function useForumThread(threadId: number) {
  return useQuery({
    queryKey: ['forums', 'thread', threadId],
    queryFn: () => forumsApi.getThread(threadId),
    enabled: !!threadId,
  });
}

export function useForumReplies(threadId: number, page = 1) {
  return useQuery({
    queryKey: ['forums', 'replies', threadId, page],
    queryFn: () => forumsApi.getReplies(threadId, page),
    enabled: !!threadId,
  });
}

export function useCreateThread(categoryId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; body: string; imageUrl?: string }) => forumsApi.createThread(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forums', 'threads', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['forums', 'categories'] });
    },
  });
}

export function useCreateReply(threadId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { body: string; parentReplyId?: number; imageUrl?: string }) => forumsApi.createReply(threadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forums', 'replies', threadId] });
      queryClient.invalidateQueries({ queryKey: ['forums', 'thread', threadId] });
    },
  });
}
