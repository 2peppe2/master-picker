import { useEffect, useId, useState } from 'react'

import { Input } from '@/components/ui/input'
import { ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'

const InputSearch = () => {
    const id = useId()
    const [isMac, setIsMac] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMac(/Mac/.test(window.navigator.platform))
        }
    }, [])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                const input = document.getElementById(id) as HTMLInputElement | null
                if (input) {
                    event.preventDefault()
                    input.focus()
                    input.select()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [id])

    return (
        <div className='flex justify-around w-full max-w-xs space-y-2 mx-auto'>
            <div className='relative'>
                <Input
                    id={id}
                    type='search'
                    placeholder='Search...'
                    className='peer pr-11 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none'
                />
                <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50'>
                    <kbd className='text-muted-foreground bg-accent inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium'>
                        {isMac ? '⌘K' : 'Ctrl K'}
                    </kbd>
                </div>
            </div>
            <Button variant='ghost' className='text-muted-foreground'>
                <ListFilter className='p-2 size-fit text-muted-foreground' />
            </Button>

        </div>
    )
}

export default InputSearch
