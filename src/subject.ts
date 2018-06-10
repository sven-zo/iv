interface Subject {
  _observers: Observer[];

  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
}
