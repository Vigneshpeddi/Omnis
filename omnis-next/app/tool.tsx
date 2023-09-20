'use client'

import { Card } from "@/components/ui/card"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useTodos, { Todo } from "@/hooks/useTodos"
import { motion } from "framer-motion"
import { FoldHorizontal, PlusCircle, UnfoldHorizontal } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from "react-beautiful-dnd"

export default function Tool() {
  const [executing, setExecuting] = useState(false)

  const {data: todos} = useTodos()


  const doNow = useMemo(() => todos?.filter(t => t.importance == 0 && t.urgency == 0), [todos])
  const schedule = useMemo(() => todos?.filter(t => t.importance == 0 && t.urgency == 1), [todos])
  const avoid = useMemo(() => todos?.filter(t => t.importance == 1 && t.urgency == 0), [todos])
  const doLater = useMemo(() => todos?.filter(t => t.importance == 1 && t.urgency == 1), [todos])


  const [items, setItems] = useState([0, 1, 2, 3])

  const [expanded, setExpanded] = useState(true)


  return(
    <motion.div layout className={"absolute right-0 bg-white shadow-lg flex flex-col gap-3 rounded-l-lg p-10 h-full top-0 pt-28 " + (expanded ? "w-9/12" : "w-4/12")}>

      <motion.div layout className="flex flex-row gap-4 items-center">
        {expanded ? 
          <FoldHorizontal onClick={() => setExpanded(false)} /> :
          <UnfoldHorizontal onClick={() => setExpanded(true)} />
        }
        <Tabs defaultValue={"planning"} className="flex flex-row items-center gap-3 mt-2">
          <TabsList>
            <TabsTrigger className="font-heading text-sm" value="planning">Planning</TabsTrigger>
            <TabsTrigger className="font-heading text-sm" value="executing">Executing</TabsTrigger>
          </TabsList>
          <NavigationMenu>
            <NavigationMenuList>
              <TabsContent value="planning">
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>Eisenhower Matrix</NavigationMenuItem>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>Opportunity Cost Analysis</NavigationMenuItem>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>Reflection</NavigationMenuItem>
              </TabsContent>

              <TabsContent value="executing">
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>Calendar</NavigationMenuItem>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>Stop Watch</NavigationMenuItem>
                <NavigationMenuItem className={navigationMenuTriggerStyle()}>Timer</NavigationMenuItem>
              </TabsContent>
            </NavigationMenuList>
          </NavigationMenu>
          <TabsContent value="planning">

          </TabsContent>


        </Tabs>
      </motion.div>

      <motion.div layout className={`grid ${expanded ? "grid-cols-2" : "grid-cols-1"} gap-10 ${expanded ? "grid-rows-2" : "grid-rows-4"} h-full`}>
        <EisenhowerBox expanded={expanded} title="Do Now" droppableId="doNow" todos={doNow} />
        <EisenhowerBox expanded={expanded} title="Schedule" droppableId="schedule" todos={schedule} />
        <EisenhowerBox expanded={expanded} title="Avoid" droppableId="avoid" todos={avoid} />
        <EisenhowerBox expanded={expanded} title="Do later" droppableId="doLater" todos={doLater} />
      </motion.div>
    </motion.div>
  )
}

function EisenhowerBox(props: {title: string, droppableId: string, todos?: Todo[], expanded: boolean}) {
  return (
    <motion.div layout className="flex flex-col gap-2 items-center">
      <motion.h4 layout>{props.title}</motion.h4>
      <Droppable droppableId={props.droppableId}>
        {(provided, snapshot) => (
          <motion.div layout {...provided.droppableProps} ref={provided.innerRef} className={`bg-primary-foreground w-full min-h-full rounded-xl flex flex-col gap-2 p-3 ${!props.expanded && "overflow-y-scroll"}`}>

            {props.todos?.map((t, index) => t && 
              <Draggable  key={t.id} draggableId={t.id} index={index} >
                {(provided, snapshot) => (

                  <motion.div layout>
                    <Card ref={provided.innerRef} style={provided.draggableProps.style} {...provided.draggableProps} {...provided.dragHandleProps} className="py-1 px-3">
                      <p>{t.title}</p>
                    </Card>
                  </motion.div>
                )
                }
              </Draggable>

            )}
            {provided.placeholder}
          </motion.div>
        )} 
      </Droppable>

    </motion.div>
  )
}
