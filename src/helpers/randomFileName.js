import dayjs from 'dayjs';

export function generateUniqueFileName(type, extension){
	const date = new Date();
	const currentTime = `${dayjs(date).format('YYYY-MM-DD')} at ${dayjs(date).format('hh.mm.ss A')}`
	return `ChatApp ${type} ${currentTime}.${extension}`;
}
