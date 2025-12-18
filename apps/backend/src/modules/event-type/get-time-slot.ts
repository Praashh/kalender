import dayjs from "dayjs";


export async function getTimeSlot(availabilityDays?: Array<number>, startTime?: Date, endTime?: Date, duration?: number){
    const currentDate = new Date();
    const currentDay = currentDate.getDay();

    console.log(dayjs(currentDate).format('YYYY-MM-DD'))
}