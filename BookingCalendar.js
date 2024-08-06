// src/BookingCalendar.js
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Container, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [haircutType, setHaircutType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'blockedSchedules'),
        where('date', '==', selectedDate.toISOString().split('T')[0])
      );
      const querySnapshot = await getDocs(q);
      const blockedTimes = querySnapshot.docs.map(doc => doc.data().time);

      const allTimes = [
        '07:00', '07:40', '08:20', '09:00', '09:40',
        '10:20', '11:00', '11:40', '12:20', '13:00',
        '13:40', '14:20', '15:00', '15:40', '16:20',
        '17:00', '17:40', '18:20', '19:00', '19:40'
      ];

      const availableTimes = allTimes.filter(time => !blockedTimes.includes(time));
      setAvailableTimes(availableTimes);
      setLoading(false);
    };

    fetchAvailableTimes();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBooking = async (time) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'appointments'), {
          date: selectedDate.toISOString().split('T')[0],
          time,
          userId: user.uid,
          name,
          haircutType,
          paymentMethod,
          createdAt: new Date()
        });
        console.log('Agendamento criado com sucesso!');
      } else {
        console.log('Usuário não autenticado.');
      }
    } catch (error) {
      console.error('Erro ao criar agendamento: ', error.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
          />
        </Col>
        <Col md={6}>
          <h3>Horários Disponíveis para {selectedDate.toDateString()}</h3>
          {loading ? (
            <p>Carregando horários...</p>
          ) : (
            <ListGroup>
              {availableTimes.map((time, index) => (
                <ListGroup.Item key={index}>
                  {time} 
                  <Button
                    variant="primary"
                    className="float-end"
                    onClick={() => handleBooking(time)}
                  >
                    Agendar
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Nome</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Digite seu nome" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formHaircutType">
              <Form.Label>Tipo de Corte</Form.Label>
              <Form.Control 
                as="select"
                value={haircutType}
                onChange={(e) => setHaircutType(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Corte Simples">Corte Simples</option>
                <option value="Corte Degradê">Corte Degradê</option>
                <option value="Barba">Barba</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Forma de Pagamento</Form.Label>
              <Form.Control 
                as="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão">Cartão</option>
                <option value="Pix">Pix</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingCalendar;
