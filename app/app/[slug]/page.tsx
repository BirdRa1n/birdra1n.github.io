'use client'
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm'

export default function Page({ params }: { params: { slug: string } }) {
    const [markdown, setMarkdown] = useState('');

    const fetchPost = async () => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .eq('id', params?.slug);

        if (data) {
            setMarkdown(data[0]?.description)
        }
    }

    useEffect(() => {
        fetchPost();
    }, [])

    return (
        <div>
            <Markdown remarkPlugins={[
        remarkGfm,
      ]}
     >{markdown}</Markdown>
        </div>
    )
}