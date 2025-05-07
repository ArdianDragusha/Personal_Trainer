import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getCustomers } from '../../Api/API';
import './Calendar.css';

const locales = {
    'en-US': enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

function Calendar() {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState('week');

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const customers = await getCustomers();
            const allTrainings = await Promise.all(
                customers.map(async (customer) => {
                    const customerHref = customer._links?.self?.href;
                    if (!customerHref) return [];

                    const customerId = customerHref.split('/').pop();
                    const response = await fetch(
                        `https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/customers/${customerId}/trainings`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        if (data._embedded?.trainings) {
                            return data._embedded.trainings.map(training => ({
                                title: `${training.activity} / ${customer.firstname} ${customer.lastname}`,
                                start: new Date(training.date),
                                end: new Date(new Date(training.date).getTime() + training.duration * 60000),
                                customerName: `${customer.firstname} ${customer.lastname}`,
                                activity: training.activity,
                                duration: training.duration
                            }));
                        }
                    }
                    return [];
                })
            );

            setEvents(allTrainings.flat());
        } catch (error) {
            console.error('Error fetching trainings:', error);
        }
    };

    return (
        <div className="calendar-container">
            <h2>Training Calendar</h2>
            <div className="calendar-wrapper">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView={view}
                    views={['month', 'week', 'day', 'agenda']}
                    step={60}
                    showMultiDayTimes
                    style={{ height: 'calc(100vh - 200px)' }}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: '#3174ad',
                            borderRadius: '4px'
                        }
                    })}
                    tooltipAccessor={event =>
                        `${event.activity} with ${event.customerName}\nDuration: ${event.duration} min`
                    }
                />
            </div>
        </div>
    );
}

export default Calendar;