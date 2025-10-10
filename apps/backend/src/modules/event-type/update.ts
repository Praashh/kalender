import type { PrismaClient } from "../../../generated/prisma";


interface UpdateEventData {
    title: string,
    duration: number,
    eventTypeId: string
  }
  
  interface IUpdateEventProp {
  prisma: PrismaClient,
  data: UpdateEventData
  }
  
  export async function updateEventType({prisma, data}: IUpdateEventProp){
    return await prisma.eventType.update({
      where:{
        id: data.eventTypeId
      },
      data:{
        title: data.title,
        duration: data.duration
      }
    })
  }