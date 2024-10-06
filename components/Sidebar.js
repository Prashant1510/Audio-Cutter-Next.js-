// components/Sidebar.js
import { Drawer, Button, Group } from '@mantine/core';
import { IconHome, IconInfoCircle } from '@tabler/icons-react'; // Importing icons
import Link from 'next/link';
const Sidebar = ({ opened, onClose }) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Menu"
      padding="lg"
      style={{ width: '200px' }} // Set a smaller custom width for the drawer
    >
      <Group direction="column" spacing="md" style={{ width: '100%' }}>
      <Link href="/">
        <Button
          variant="subtle"
          onClick={onClose} // Add your home button functionality here
          leftIcon={<IconHome size={16} />}
          style={{ justifyContent: 'flex-start', width: '100%' }} // Full width and left-aligned
        >
          Home
        </Button>
        </Link>
        <Link href="/About" >
        <Button
          variant="subtle"
          onClick={onClose} // Add your about button functionality here
          leftIcon={<IconInfoCircle size={16} />}
          style={{ justifyContent: 'flex-start', width: '100%' }} // Full width and left-aligned
        >
          About
        </Button>
        </Link>
      </Group>
    </Drawer>
  );
};

export default Sidebar;
