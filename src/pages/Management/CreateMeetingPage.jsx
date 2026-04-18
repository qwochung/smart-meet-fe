import { Button, Card, Input } from '../../components/common';
import {useState} from "react";
import api from "../../api";
import { useNavigate } from 'react-router-dom';

export default function CreateMeetingPage() {
  const [meetingName, setMeetingName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: meetingName,
      hostId: 1, // TODO: Lấy hostId từ user hiện tại
      description: description,
    }

    try {
      console.log(api.room.createRoom);
      const response = await api.room.createRoom(payload);
      console.log(response);
      console.log(navigate);
      if (response?.roomCode) {
        navigate(`/room/${response.roomCode}`);
      }
    } catch (error) {
      console.error("Create room failed:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tạo cuộc họp mới</h1>
        <p className="mt-1 text-sm text-slate-500">Thiết lập chương trình, người tham gia và lịch họp.</p>
      </div>

      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <Input
              name="meetingName"
              label="Tiêu đề cuộc họp"
              placeholder="VD: Đồng bộ sản phẩm hằng tuần"
              value={meetingName}
              onChange={(event) => setMeetingName(event.target.value)}
            />
          </div>
          <Input label="Ngày" type="date" />
          <Input label="Giờ" type="time" />
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Chương trình họp</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              rows={5} placeholder="Nhập chương trình họp..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type ="submit">Tạo cuộc họp</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
