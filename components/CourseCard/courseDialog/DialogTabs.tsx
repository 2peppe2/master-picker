'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type DialogTabsProps = {
    tabs: {
        name: string;
        value: string;
        content: React.ReactNode;
    }[];

}

const DialogTabs = ({tabs}: DialogTabsProps) => {
    const measureRefs = useRef<(HTMLDivElement | null)[]>([])
    const [contentHeight, setContentHeight] = useState(0)

    const updateContentHeight = () => {
        const heights = measureRefs.current.map((el) => el?.offsetHeight ?? 0)
        const maxHeight = Math.max(0, ...heights)

        setContentHeight((prev) => (prev === maxHeight ? prev : maxHeight))
    }

    useLayoutEffect(() => {
        updateContentHeight()
    }, [tabs])

    useEffect(() => {
        if (typeof ResizeObserver === 'undefined') {
            return
        }

        const observer = new ResizeObserver(() => {
            updateContentHeight()
        })

        measureRefs.current.forEach((el) => {
            if (el) {
                observer.observe(el)
            }
        })

        return () => {
            observer.disconnect()
        }
    }, [tabs])

    const contentStyle = contentHeight > 0 ? { height: `${contentHeight}px` } : undefined

    return (
        <div className='relative w-full'>
            <div className='absolute inset-x-0 top-0 opacity-0 pointer-events-none' aria-hidden='true'>
                {tabs.map((tab, index) => (
                    <div
                        key={`measure-${tab.value}`}
                        ref={(el) => {
                            measureRefs.current[index] = el
                        }}
                    >
                        <div className='text-muted-foreground text-sm w-full'>{tab.content}</div>
                    </div>
                ))}
            </div>
            <Tabs defaultValue={tabs[0]?.value ?? ''} className='gap-4'>
                <TabsList className='bg-background rounded-none border-b p-0'>
                    {tabs.map(tab => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className='bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:border-muted-foreground/30 h-full rounded-none border-0 border-b-2 border-transparent data-[state=active]:shadow-none'
                        >
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map(tab => (
                    <TabsContent
                        key={tab.value}
                        value={tab.value}
                        className='flex-none overflow-y-auto'
                        style={contentStyle}
                    >
                        <div className='text-muted-foreground text-sm w-full'>{tab.content}</div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default DialogTabs;
