import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './index.css';

function ClientPage() {
  const [schedules, setSchedules] = useState([]);
  const [blockedSchedules, setBlockedSchedules] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const scheduleCollection = await getDocs(collection(db, 'schedules'));
      setSchedules(scheduleCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const blockedScheduleCollection = await getDocs(collection(db, 'blockedSchedules'));
      setBlockedSchedules(blockedScheduleCollection.docs.map(doc => doc.data().time));

      const servicesCollection = await getDocs(collection(db, 'services'));
      setServices(servicesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const bookAppointment = async () => {
    await addDoc(collection(db, 'appointments'), {
      name,
      schedule: selectedSchedule,
      service: selectedService
    });
    setName("");
    setSelectedSchedule("");
    setSelectedService("");
  };

  return (
    <Container>
      <h1 className="my-4">Agendar Serviço</h1>
      <Form>
        <Form.Group controlId="formName">
          <Form.Label>Seu Nome</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu Nome" />
        </Form.Group>
        <Form.Group controlId="formSchedule" className="mt-2">
          <Form.Label>Selecione o Horário</Form.Label>
          <Form.Control as="select" value={selectedSchedule} onChange={(e) => setSelectedSchedule(e.target.value)}>
            <option value="">Selecione um Horário</option>
            {schedules
              .filter(schedule => !blockedSchedules.includes(schedule.time))
              .map(schedule => (
                <option key={schedule.id} value={schedule.time}>{schedule.time}</option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formService" className="mt-2">
          <Form.Label>Selecione o Serviço</Form.Label>
          <Form.Control as="select" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">Selecione um Serviço</option>
            {services.map(service => (
              <option key={service.id} value={service.name}>{service.name} - ${service.price}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={bookAppointment} className="mt-4">Agendar</Button>
      </Form>
    </Container>
  );
}

export default ClientPage;
