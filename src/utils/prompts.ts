import inquirer from 'inquirer';

export async function confirmAction(message: string): Promise<boolean> {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: false,
    },
  ]);
  return confirmed;
}

export async function promptForInput(message: string, defaultValue?: string): Promise<string> {
  const { value } = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message,
      default: defaultValue,
      validate: (input: string) => {
        if (!input || input.trim() === '') {
          return 'This field is required';
        }
        return true;
      },
    },
  ]);
  return value;
}
