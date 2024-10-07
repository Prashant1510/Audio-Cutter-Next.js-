import { Drawer, Button, Group } from '@mantine/core';
import { IconHome, IconInfoCircle } from '@tabler/icons-react'; 
import Link from 'next/link';

const Sidebar = ({ opened, onClose }) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Menu"
      padding="lg"
      size="150px"  
    >
      <Group direction="column" spacing="md" style={{ width: '100%' }}>
        <Link href="/">
          <Button
            variant="subtle"
            onClick={onClose} 
            leftIcon={<IconHome size={20} />}
            style={{ justifyContent: 'flex-start', width: '100%' }} 
          >
            Home
          </Button>
        </Link>
        <Link href="/About">
          <Button
            variant="subtle"
            onClick={onClose} 
            leftIcon={<IconInfoCircle size={20} />}
            style={{ justifyContent: 'flex-start', width: '100%' }} 
          >
            About
          </Button>
        </Link>
      </Group>
    </Drawer>
  );
};

export default Sidebar;
