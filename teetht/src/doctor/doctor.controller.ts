import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConditionSelectionArrayDto } from 'src/dto/conditionSelectionDto';
import { SessionDeleteDto } from 'src/dto/sessionDeleteDto';
import { UpdateDoctorDto } from 'src/dto/updateDto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(JwtGuard)
  @Post('chooseCondition')
  async chooseDoctorCondition(
    @Body() conditionSelectionArrayDoctorDto: ConditionSelectionArrayDto,
    @Request() req: any,
  ) {
    const doctorSessionDTO = await this.doctorService.saveDoctorChoices(
      conditionSelectionArrayDoctorDto.selections,
      req.user.id,
    );

    return doctorSessionDTO;
  }

  @UseGuards(JwtGuard)
  @Post('deleteConditions')
  async deleteDoctorConditions(
    @Body() doctorSessionDeleteDto: SessionDeleteDto,
    @Request() req: any,
  ): Promise<any> {
    await this.doctorService.deleteDoctorSession(
      doctorSessionDeleteDto,
      req.user.id,
    );
    return {
      message:
        'The doctor session and related cases have been successfully deleted ',
    };
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') userId: number): Promise<any> {
    return this.doctorService.deleteUser(userId);
  }
  @UseGuards(JwtGuard)
  @Post('findUsersInSameGovernorate')
  async findUsersInSameGovernorate(@Request() req) {
    try {
      const users = await this.doctorService.findMatchingUsersInSameGobernorate(
        req.user.id,
      );
      return {
        status: 'success',
        data: users,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
  @UseGuards(JwtGuard)
  @Post('findUsersInOtherGovernorate')
  async findUsersInOtherGovernorate(
    @Request() req,
    @Body('selectedGovernorate') selectedGovernorate: string,
  ) {
    try {
      const users =
        await this.doctorService.findMatchingUsersInOtherGobernorate(
          req.user.id,
          selectedGovernorate,
        );
      return {
        status: 'success',
        data: users,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  updateDoctor(
    @Param('id') id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctor(id, updateDoctorDto);
  }
}
