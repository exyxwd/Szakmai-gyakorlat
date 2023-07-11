import { useSelector, useDispatch } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RootState, FormState as FormData } from './store';

const setName = (name: string) => {
  return {
    type: 'SET_NAME',
    payload: name
  } as const;
};

const setEmail = (email: string) => {
  return {
    type: 'SET_EMAIL',
    payload: email
  } as const;
};

function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const dispatch = useDispatch();

  const name = useSelector((state: RootState) => state.form.name);
  const email = useSelector((state: RootState) => state.form.email);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    dispatch(setName(data.name));
    dispatch(setEmail(data.email));
  };

  return (
    <div>
      <h1>React Hook Form + React Redux</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name: </label>
          <input {...register('name', { required: true })} />
          {errors.name && <span>This field is required</span>}
        </div>
        <div>
          <label>Email: </label>
          <input {...register('email', { required: true, pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i })} />
          {errors.email && <span>Invalid email address</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <h2>Stored Form Data</h2>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
      </div>
    </div>
  );
}

export default App;