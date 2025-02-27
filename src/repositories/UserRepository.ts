import { User, IUser } from '../models/User';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/UserDTO';

class UserRepository {
    async create(data: CreateUserDTO): Promise<IUser> {
        const user = new User(data);
        await user.save();
        return user;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
        return await User.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<void> {
        await User.findByIdAndDelete(id);
    }
}

export default new UserRepository();