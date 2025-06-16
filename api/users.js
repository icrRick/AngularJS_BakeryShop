export default function handler(req, res) {
  res.status(200).json([
    {
      "name": "Rick",
      "email": "rick@gmail.com",
      "phone": "07xxxxxxxx",
      "password": "rick123",
      "address": "Cần Thơ",
      "gender": "male",
      "id": "0cb1"
    },
    {
      "id": "17b0",
      "address": "Cần Thơ",
      "gender": "male",
      "phone": "0788755000",
      "name": "Trọng Trí",
      "email": "pickleRick@gmail.com",
      "password": "rick123"
    }
  ]);
}
