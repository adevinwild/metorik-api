import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Menu } from '@headlessui/react'
import {
    Button,
    Card,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
    Text,
} from '@tremor/react'
import { IconBolt, IconDots, IconHelp, IconPlus, IconRefresh } from 'tabler-icons'

import withTemplate from '@/components/hocs/withTemplate'
import BodyCard from '@/components/ui/BodyCard/BodyCard'
import { useEvents } from '@/domain/shared/use-events'
import { AppTemplate } from '@/templates/App.template'

import CreateEventModal from './new/create-event-modal'

const cardProps = {
    heading: 'Events',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.',
}

const EventsOverview = () => {
    const { eventsQuery, dispatchEventMutation, resetEventMutation, invalidate } = useEvents()
    const documents = eventsQuery.data?.documents
    const total = eventsQuery.data?.total
    const [isModalOpen, setIsModalOpen] = useState(false)

    const onDispatchEvent = async (event: string) => {
        try {
            await dispatchEventMutation.mutateAsync(event)
            toast.success('Event dispatched successfully')
        } catch (err) {
            toast.error('An error has occured while dispatching event')
        }
    }

    const onResetEvent = async (identifier: string) => {
        try {
            await resetEventMutation.mutateAsync(identifier)
            toast.success('Event reset successfully')
            await invalidate()
        } catch (err) {
            toast.error('An error has occured while resetting event')
        }
    }

    if (eventsQuery.error) {
        return (
            <BodyCard {...cardProps}>
                <div className="flex items-center justify-center w-full h-full">
                    <Text>An error has occured while fetching events. </Text>
                    <Button
                        className="ml-2"
                        variant="secondary"
                        color="pink"
                        size="xs"
                        onClick={() => eventsQuery.refetch()}
                    >
                        Retry
                    </Button>
                </div>
            </BodyCard>
        )
    }

    if (eventsQuery.isLoading) {
        return (
            <BodyCard {...cardProps}>
                <div className="flex items-center justify-center w-full h-full">
                    <Text>Loading events...</Text>
                </div>
            </BodyCard>
        )
    }

    if (!documents?.length) {
        return (
            <>
                <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                <BodyCard {...cardProps}>
                    <div className="flex flex-col items-center justify-center h-full w-full">
                        <div className="max-w-xs text-center">
                            <Text className="text-lg font-semibold text-neutral-400">No events found</Text>
                            <Text className="text-sm leading-8 text-neutral-400">
                                Create an event to get started :{' '}
                                <Button
                                    className="ml-2"
                                    variant="secondary"
                                    color="pink"
                                    size="xs"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Create Event
                                </Button>
                            </Text>
                        </div>
                    </div>
                </BodyCard>
            </>
        )
    }

    return (
        <>
            <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <Card className="flex flex-col h-full ">
                <div className="flex w-full items-center">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl text-neutral-600 font-semibold">Events</h3>
                        <p className="text-sm text-neutral-400">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.
                        </p>
                    </div>

                    <Button
                        icon={IconPlus}
                        onClick={() => setIsModalOpen(true)}
                        className="ml-auto max-h-max text-xs"
                        variant="secondary"
                        color="pink"
                        size="xs"
                    >
                        Create Event
                    </Button>
                </div>
                <hr className="w-full border-neutral-200 my-4" />
                <Table className="relative h-full">
                    <TableHead>
                        <TableHeaderCell>Label</TableHeaderCell>
                        <TableHeaderCell className="flex items-center gap-x-2">
                            Handle
                            <IconHelp className="h-4 w-4 text-neutral-400" />
                        </TableHeaderCell>
                        <TableHeaderCell>Type</TableHeaderCell>
                        <TableHeaderCell>Value</TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                    </TableHead>
                    <TableBody>
                        {!!documents?.length &&
                            documents.map((event) => {
                                const isDispatching =
                                    dispatchEventMutation.isLoading &&
                                    dispatchEventMutation.variables === event.identifier
                                const isResetting =
                                    resetEventMutation.isLoading && resetEventMutation.variables === event.identifier
                                const isProcessing = isDispatching || isResetting

                                return (
                                    <TableRow
                                        key={event.$id}
                                        className={`${isProcessing && 'blur'} transition-all duration-300 ease-out`}
                                    >
                                        <TableCell>{event.title}</TableCell>
                                        <TableCell>
                                            <kbd className="bg-neutral-100 text-neutral-400 p-1 rounded shadow-sm">
                                                {event.identifier}
                                            </kbd>
                                        </TableCell>
                                        <TableCell>
                                            <kbd className="bg-neutral-100 text-neutral-400 p-1 rounded shadow-sm">
                                                {event.type}
                                            </kbd>
                                        </TableCell>
                                        <TableCell>{event.value}</TableCell>
                                        <TableCell className="flex relative items-center gap-x-2">
                                            {/* <IconDots className="w-4 h-4" /> */}
                                            <Menu>
                                                <Menu.Button className="hover:bg-neutral-50 p-2 rounded transition-all duration-200 ease-in-out">
                                                    <IconDots className="w-4 h-4" />
                                                </Menu.Button>
                                                <Menu.Items className="absolute z-10 xl:min-w-[15rem] right-8 flex-col flex gap-y-4 top-10 p-4 bg-white rounded-xl shadow-lg border border-neutral-200">
                                                    <small>Actions</small>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                type="button"
                                                                onClick={() => onDispatchEvent(event.identifier)}
                                                                className={`${
                                                                    active && 'bg-neutral-50'
                                                                } px-2.5 py-1.5 transition-all duration-300 ease-in-out hover:pl-2 flex items-center gap-x-2 rounded group`}
                                                            >
                                                                <IconBolt className="w-4 h-4 mr-2 group-hover:-rotate-12 transition-all duration-300 ease-in-out" />
                                                                Dispatch
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    <hr />
                                                    <small>Danger Zone</small>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                type="button"
                                                                onClick={() => onResetEvent(event.identifier)}
                                                                className={`${
                                                                    active && 'bg-red-50 text-red-400'
                                                                }  px-2.5 py-1.5 transition-all duration-300 ease-in-out hover:pl-2 flex items-center gap-x-2 rounded group`}
                                                            >
                                                                <IconRefresh className="w-4 h-4 mr-2 group-hover:-rotate-12 transition-transform duration-300 ease-in-out" />
                                                                Reset
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Menu>
                                            {/* <Button
                size="xs"
                variant="secondary"
                disabled={dispatchEventMutation.isLoading}
                loading={dispatchEventMutation.isLoading}
                onClick={() => onDispatchEvent(event.identifier)}>
                Dispatch
            </Button>
            <Button
                size="xs"
                variant="secondary"
                color="red"
                disabled={resetEventMutation.isLoading}
                loading={resetEventMutation.isLoading}
                onClick={() => onResetEvent(event.identifier)}>
                Reset
            </Button> */}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>

                <span className="text-sm text-neutral-400">
                    <b>{total || 0}</b> found
                </span>
            </Card>
        </>
    )
}

export default withTemplate(EventsOverview, AppTemplate)
