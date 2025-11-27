'use client';
import { useEffect, useState } from 'react';

export default function useFetch(path) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetch(path)
            .then(r => r.json())
            .then(json => { if (mounted) setData(json); })
            .catch(() => { if (mounted) setData([]); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [path]);

    return { data, loading };
}
