The repair service card — device type, repair type, estimated time, starting price, and an orange Book Repair button. This is a service surface, so it uses orange (accent + button).

```jsx
<RepairCard
  repair={{ deviceType: 'iPhone', repairType: 'Screen Replacement', time: '45 min', startingPrice: 89, icon: 'smartphone' }}
  onBook={() => openRepairForm()}
/>
```
